export class Mail {
    public sender: string;     
    public recipient: string;
    public subject: string;
    public body: string;
    public timestamp: string;    
    public read: boolean; 
    public archived: boolean;

   constructor (
       sender: string,     
       recipient: string,
       subject: string,
       body: string,
       timestamp: string,    
       read: boolean, 
       archived: boolean,
   ){
       this.sender= sender;     
       this.recipient= recipient;
       this.subject= subject;
       this.body= body;
       this.timestamp= timestamp;    
       this.read= read; 
       this.archived= archived;
   }
}