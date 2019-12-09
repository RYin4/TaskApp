import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  listId: string

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params.get('listId')
        console.log(this.listId)

      }
    )
  }




  createTask(title: string, listId: string) {
    this.taskService.createTask(title, listId)

  }

}
