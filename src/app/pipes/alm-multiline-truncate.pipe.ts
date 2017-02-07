import { Pipe, PipeTransform } from '@angular/core';

/*
 * Usage:
 *   {{ aParagraph | almMultilineTruncate:charCount }}
 *
 * Example:
 *  paragraph = "Lorem Ipsum is simply dummy text of the printing and
 *               typesetting industry. Lorem Ipsum has been the industry's
 *               standard dummy text ever since the 1500s, when an unknown
 *               printer took a galley of type and scrambled it to make a
 *               type specimen book. "
 *
 * {{ paragraph | almMultilineTruncate:150 }}
 *
 * Output:
 * "Lorem Ipsum is simply dummy text of the printing and typesetting
 *  industry. Lorem Ipsum has been the industry's standard dummy..."
*/

@Pipe({ name: 'almMultilineTruncate' })
export class AlmMultilineTruncate implements PipeTransform {
  transform(val: string, charCount: number): any {
    if (!val) {
      return '';
    }
    let substring = val.slice(0, charCount);
    if (val.length > charCount){
      return substring + '...';
    }

    return val;
  }
}
