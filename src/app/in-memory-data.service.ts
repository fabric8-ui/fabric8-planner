import { InMemoryDbService } from 'angular2-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let workItems = [

      {"fields":{"system.assignee":"someUser1","system.creator":"someOtherUser1","system.description":"Some Description 1","system.state":"new","system.title":"Some Title 1"},"id":"1","type":"system.userstory","version":1},
      {"fields":{"system.assignee":"someUser2","system.creator":"someOtherUser2","system.description":"Some Description 2","system.state":"open","system.title":"Some Title 2"},"id":"2","type":"system.bug","version":1},
      {"fields":{"system.assignee":"someUser3","system.creator":"someOtherUser3","system.description":"Some Description 3","system.state":"closed","system.title":"Some Title 3"},"id":"3","type":"system.userstory","version":1},
      {"fields":{"system.assignee":"someUser4","system.creator":"someOtherUser4","system.description":"Some Description 4","system.state":"resolved","system.title":"Some Title 4"},"id":"4","type":"system.bug","version":1},
      {"fields":{"system.assignee":"someUser5","system.creator":"someOtherUser5","system.description":"Some Description 5","system.state":"rejected","system.title":"Some Title 5"},"id":"5","type":"system.userstory","version":1}
    ];

    let loginStatus = {
      "status": 200,
      "responseText": "Good Job"
    };

    return {loginStatus, workItems};
  }
}
