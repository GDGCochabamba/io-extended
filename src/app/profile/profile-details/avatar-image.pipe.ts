import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarImage',
  standalone: true,
})
export class AvatarImagePipe implements PipeTransform {
  transform(photoURL: string | undefined | null): string {
    return `url(${
      photoURL || 'https://material.angular.io/assets/img/examples/shiba1.jpg'
    })`;
  }
}
