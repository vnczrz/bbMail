export class User {
    //TypeScript shortcut of automatically storing arguments of the constructor in properties of the class by adding an accessor in front of the argument
    constructor(
        public email: string,  
        public id: string, 
        //private because the token should not be retrievable like this, instead when the user or you want to get access to the token you should have to check the validity... this can be achieved w a getter
        private _token: string, 
        private _tokenExpirationDate: Date
        ) { }

        ///can access this function with user.token notation
        //its a property where you can write code that when you try to access this property in the interface/model
        get token(){
            //check if _tokenExpirationDate exists and if is has expired(in the past) 
            if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
                return null;
            }
            
            return this._token
        }
}