/* tslint:disable */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public toggleStatus = true;     // Value Should be 'true' or 'false'
  public headerHeight = 50;
  public asidebarHeight = window.innerHeight;
  public contentHeight = window.innerHeight - this.headerHeight;
  public screenTitle = 'Dashboard';

  public deviceType: string = 'desktop';       // Value should be mobile, tablet, desktop

  public defaultDeviceType = ['mobile', 'tablet', 'desktop'];


  private tStatus = new BehaviorSubject<boolean>(this.toggleStatus);
  tStatusCast = this.tStatus.asObservable();

  private setCtHeight = new BehaviorSubject<any>(this.contentHeight);
  contentHeightCast = this.setCtHeight.asObservable();

  private setAsidebarHeight = new BehaviorSubject<any>(this.asidebarHeight);
  setAsidebarHeightCast = this.setAsidebarHeight.asObservable();

  private appDeviceType = new BehaviorSubject<string>(this.deviceType);
  deviceTypeCast = this.appDeviceType.asObservable();

  private screenTitleSubject = new BehaviorSubject<string>(this.screenTitle);
  screenTitleCast = this.screenTitleSubject.asObservable();


  constructor() {
  }

  getToggleStatus() {
    this.toggleStatus = !this.toggleStatus;
    this.tStatus.next(this.toggleStatus);
  }

  getDeviceType(dt: string) {
    this.appDeviceType.next(dt);
  }

  setScreenTitle(tl: string) {
    this.screenTitleSubject.next(tl);
  }


  checkWindowWidth(windowWidth: number) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = this.defaultDeviceType[1];
    } else if (windowWidth < 768) {
      this.deviceType = this.defaultDeviceType[0];
    } else {
      this.deviceType = this.defaultDeviceType[2];
    }
    this.getDeviceType(this.deviceType);
  }

  getVerticalNavbarOnWindowResize(windowWidth: number) {
    this.checkWindowWidth(windowWidth);
  }

}
