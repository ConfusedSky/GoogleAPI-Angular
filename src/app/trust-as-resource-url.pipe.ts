import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'trustAsResourceUrl'
})
export class TrustAsResourceUrlPipe implements PipeTransform {
  constructor(private sanitizer : DomSanitizer){}

  transform(url: string) : SafeResourceUrl {
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return sanitizedUrl;
  }

}
