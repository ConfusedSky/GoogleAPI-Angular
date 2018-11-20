import { NgZone, Injectable } from '@angular/core';
import { File } from './file';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  constructor(
    private zone : NgZone,
  ) { }

  children(folderId : string) : gapi.client.HttpRequest<any>
  {
    return gapi.client.request(
    {
      path: `https://www.googleapis.com/drive/v2/files/${folderId}/children`,
      params: {
        'orderBy': 'folder,title',
        'q': 'trashed = false and ' +
          'mimeType = "application/vnd.google-apps.document" or ' +
          'mimeType = "text/plain" or ' +
          'mimeType = "text/markdown" or ' +
          'mimeType = "text/html"'
      }
    })
  }

  file(fileId: string) : gapi.client.HttpRequest<any> {
    return gapi.client.request({
      path: `https://www.googleapis.com/drive/v2/files/${fileId}`,
      params: {
        'fields': "mimeType, iconLink, title, modifiedDate, downloadUrl"
      },
    })
  }

  exportFile(fileId: string) : gapi.client.HttpRequest<any> {
    return gapi.client.request({
      path: `https://www.googleapis.com/drive/v2/files/${fileId}/export`,
      params: {
        'mimeType': "text/html"
      }
    });
  }

  downloadFile(file: File) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if(file.downloadUrl)
      {
        var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);

        xhr.onload = function() {

          let text = xhr.responseText;

          if(file.name.includes(".html"))
          {
            resolve(text);
          }
          else
          {
            let html = `
            <html>
              <head>
              <style>
                body {
                  display: block;
                  overflow-wrap: break-word;
                  white-space: pre-wrap;
                  margin: 8px;
                  width: 85%;
                }
              </style>
              </head>

              <body>${text}</body>
            </html> 
            `
            resolve(html);
          }
        }

        xhr.onerror = function() {
          reject("Download failed.");
        }
        xhr.send();
      } else {
        this.exportFile(file.id).then(
          value => {
            resolve(value.body);
          },
          reason =>
          {
            reject(reason);
          }
        )
      }
    });
  }

  getFiles(folder: string): Promise<File[]> {
    return new Promise((resolve, reject) => {
      this.zone.run(()=>{
        this.children(folder).execute((resp) => {
          console.log(resp);
          var files = resp.items.map(x=>{
            return {id: x.id};
          });

          var batch = gapi.client.newBatch();
          for(let i = 0; i < files.length; i++) {
            batch.add(this.file(files[i].id), {
              id: String(i),
              callback: null
            })
          }
          batch.execute((respMap, raw) =>{
            console.log(respMap);
            for(let i = 0; i < files.length; i++)
            {
              if(respMap[String(i)].error)
              {
                files[i].name = "Error";
                continue;
              }
              files[i].name = respMap[String(i)].result.title;
              files[i].modifiedDate = respMap[String(i)].result.modifiedDate;
              files[i].img = respMap[String(i)].result.iconLink;
              files[i].downloadUrl = respMap[String(i)].result.downloadUrl;
            }
            resolve(files);
          });
        });
      });
    });
  }
}
