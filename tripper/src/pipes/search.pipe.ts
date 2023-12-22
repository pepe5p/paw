import { Pipe, PipeTransform } from '@angular/core';
import {TripWithId} from "../models/trip.model";

@Pipe({
  standalone: true,
  name: 'searchPipe',
})
export class SearchPipe implements PipeTransform {
  transform(courses: TripWithId[], searchText: string): TripWithId[] {
    if (!courses)
      return [];
    if (!searchText)
      return courses;
    searchText = searchText.toLowerCase();
    return courses.filter(course => {
      return course.name.toLowerCase().includes(searchText);
    });
  }
}
