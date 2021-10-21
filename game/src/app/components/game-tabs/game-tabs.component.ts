import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/app/models';

@Component({
  selector: 'app-game-tabs',
  templateUrl: './game-tabs.component.html',
  styleUrls: ['./game-tabs.component.css']
})
export class GameTabsComponent implements OnInit, OnDestroy {
  @Input() game2?: Game

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log(this.game2)
  }

}
