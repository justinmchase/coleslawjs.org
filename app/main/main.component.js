import { Component } from '@angular/core'

@Component({
  selector: 'main',
  templateUrl: 'main/main.html'
})
export class MainComponent {

  constructor () {
    this.entries = [
      { id: 0, text: 'testing...' },
      { id: 1, text: '123.' }
    ]
  }

}
