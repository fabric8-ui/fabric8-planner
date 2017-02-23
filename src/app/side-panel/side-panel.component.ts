import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  host:{
      'class':"app-component flex-container in-column-direction flex-grow-1"
  },
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidepanelComponent implements OnInit {


  constructor(
    private router: Router) {
  }

  ngOnInit() {
  }

}
