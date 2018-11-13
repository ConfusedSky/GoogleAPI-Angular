export const API_KEY : string = 'AIzaSyBpSSbg_QP6v_iGiH4jk0Meq33iGc_XGXI'
export const clientID : string = '545871158795-s05hgnbfeougt9j5crp034acfptb3479.apps.googleusercontent.com'

export const auth_uri : string = 'https://accounts.google.com/o/oauth2/auth';
export const token_uri : string = 'https://www.googleapis.com/oauth2/v3/token';

export const sheet_id : string = '1-GOGwk4F1mrVciAK3Qvu3Ol6Wu_OvXBqoT2btq6XUlo'
export const ranges : string = "B2"

export const base_url : string = 'https://sheets.googleapis.com/v4/spreadsheets'


//const makeApiCall() : string {
  //var params = {
    //// The spreadsheet to request.
    //spreadsheetId: '1-GOGwk4F1mrVciAK3Qvu3Ol6Wu_OvXBqoT2btq6XUlo',  // TODO: Update placeholder value.
        
    //// The ranges to retrieve from the spreadsheet.
    //range: 'B2',  // TODO: Update placeholder value.
    //valueRenderOption: 'UNFORMATTED_VALUE',
    //dateTimeRenderOption: 'SERIAL_NUMBER',
    //majorDimension: 'ROWS'
  //}

  //var url : string = `https://content-sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${params.range}`+
                     //`?valueRenderOption=${params.valueRenderOption}`+
                     //`&dateTimeRenderOption=${params.dateTimeRenderOption}` +
                     //`&majorDimension=${params.majorDimension}`+
                     //`&key=${API_KEY}`

  //this.http.get(url, this.auth.getOptions()).pipe(
    //catchError(
      //(err: any) : Observable<any> => {
        //console.error(err);
        //return of([] as any)
      //}
    //)
  //).subscribe(result => {
    //this.title = `${baseTitle}: ${result.values[0]}`;
    //this.app.tick();
  //});
//}