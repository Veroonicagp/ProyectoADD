import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mi-activities',
  templateUrl: './mi-activities.page.html',
  styleUrls: ['./mi-activities.page.scss'],
})
export class MiActivitiesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  /*** 
  private async presentModalActivity(mode:'new'|'edit', person:Person|undefined=undefined){
    let _groups:Group[] = await lastValueFrom(this.groupSvc.getAll())
    const modal = await this.modalCtrl.create({
      component:PersonModalComponent,
      componentProps:(mode=='edit'?{
        person: person,
        groups: _groups
      }:{
        groups: _groups
      })
    });
    modal.onDidDismiss().then((response:any)=>{
      switch (response.role) {
        case 'new':
          this.peopleSvc.add(response.data).subscribe({
            next:res=>{
              this.loadGroups();
            },
            error:err=>{}
          });
          break;
        case 'edit':
          this.peopleSvc.update(person!.id, response.data).subscribe({
            next:res=>{
              this.loadGroups();
            },
            error:err=>{}
          });
          break;
        default:
          break;
      }
    });
    await modal.present();
  }

  async onAddActivity(){
    await this.presentModalActivity('new');
  }
*/

}
