export class User {
  // user_id: number;
  // username: string;
  // email: string;
  // password: string;
  // confirmpassword: string;
  // level: string;
  // status: number;
  // image: string;
  // lastlogin: Date;
  // created: Date;
  //
  // constructor() {
  //   this.username = "";
  //   this.email = "";
  //   this.password = "";
  //   this.confirmpassword = "";
  //   this.status = 0;
  // }

    userName: string;
    userEmail: string;
    userPassword: string;
    confirmPassword: string;
    userLevel: string;
    userStatus: number;
    userImage: string;
    userLastlogin: Date;
    userCreated: Date;

    constructor() {
        this.userName = '';
        this.userEmail = '';
        this.userPassword = '';
        this.confirmPassword = '';
        this.userStatus = 1;
        this.userImage = '';
    }

}
