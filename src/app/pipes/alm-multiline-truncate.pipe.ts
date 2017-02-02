import { Pipe, PipeTransform } from '@angular/core';

/*
 * Usage:
 *   {{ aParagraph | almMultilineTruncate:wordCount }}
 *
 * Example:
 *  paragraph = "Lorem Ipsum is simply dummy text of the printing and
 *               typesetting industry. Lorem Ipsum has been the industry's
 *               standard dummy text ever since the 1500s, when an unknown
 *               printer took a galley of type and scrambled it to make a
 *               type specimen book. "
 *
 * {{ paragraph | almMultilineTruncate:20 }}
 *
 * Output:
 * "Lorem Ipsum is simply dummy text of the printing and typesetting
 *  industry. Lorem Ipsum has been the industry's standard dummy..."
*/

@Pipe({ name: 'almMultilineTruncate' })
export class AlmMultilineTruncate implements PipeTransform {
  transform(val: string, wordCount: number): any {
    if (!val) {
      return '';
    }
    let words = val.split(' ');
    if (words.length > wordCount){
      words[wordCount - 1] = words[wordCount - 1] + '...';
      return words.slice(0, wordCount).join(' ');
    }

    return val;
  }
}
