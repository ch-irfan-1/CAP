import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { User } from '@NFS_Entity/User-Entity/UserInfoEntity';

@Component({
    selector: 'side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css'],
    standalone: false
})
export class SideNavComponent implements OnInit {

  mobileQuery: MediaQueryList;
  classApplied = false;
  // menuOpenHeader = false;
  username!: string;
  menu!: string[];
  elementClicked = 'DashBoard';
  accordianMenuOpn = false;
  panelOpenState = false;

  IsAPCuserLoggedin: boolean = true;


  //someField: boolean = false;
  // alternatively also the host parameter in the @Component()` decorator can be used
  @HostBinding('class.someClass') someField: boolean = false;

  private _mobileQueryListener: () => void;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private _dialog: DialogBoxService,
    private storageService: ClientStoreService,
    public appConfig: AppConfigService,
    private headerTitleService: HeaderTitleService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.menu = ["Dashboard", "Lead", "WorkQueue"];
  }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    let userInfo: User = this.storageService.GetUserInfo();
    this.username = userInfo.UserName;

    if (this.storageService.GetUserGroupCode() == '00105' || this.storageService.GetUserGroupCode() == '00108') {
      this.IsAPCuserLoggedin = false;
    }
    else {
      this.IsAPCuserLoggedin = true;
    }

    this.headerTitleService.title.subscribe(updatedTitle => {
      this.elementClicked = updatedTitle;
    });
  }

  openMenu() {
    this.classApplied = !this.classApplied;
    this.someField = !this.someField; // set class `someClass` on `<body>`
  }
  openAccordian() {
    this.accordianMenuOpn = !this.accordianMenuOpn;
  }
  // headerMenu() {
  //   this.menuOpenHeader = !this.menuOpenHeader;
  // }

  openDialog() {
    var dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to logout?", false, "Yes", "No");
    dialog.afterClosed().subscribe(result => {
      if (result === "ok") {
        this.logout(result);
      }
    });
  }

  public logout(event: Event) {
    this.authService.Logout().subscribe(res => {
      this.router.navigate(['/login']);
    });
  }

  onItemClick(index: number) {

  }

  setClass(name: string) {
    switch (name) {
      case "Dashboard":
        return "dashboardIcon";
        break;
      case "Lead":
        return "iops";
        break;
      default:
        return "iops";
        break;

    }

  }

  clickMe(event: Event, id: number) {
    //this.elementClicked = 'You clicked: '; 
    switch (id) {
      case 1:
        this.elementClicked = "Lead";
        break;
      case 2:
        this.elementClicked = "Work Queue";
        break;
      case 3:
        this.elementClicked = "DashBoard";
        break;
      case 4:
        this.elementClicked = "Proposal";
        break;
      case 5:
        this.elementClicked = "Proposal Queue";
        break;
      default:
        this.elementClicked = '';
        break;
    }
  }
}
