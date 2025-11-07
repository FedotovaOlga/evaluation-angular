import { Component, Input } from '@angular/core';
import { Formation } from '../../models/formation';

@Component({
  selector: 'app-formation',
  imports: [],
  templateUrl: './formation.html',
  styleUrl: './formation.css',
})
export class FormationComponent {
  @Input() formation!: Formation

}
