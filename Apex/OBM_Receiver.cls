@RestResource(urlMapping='/HandleOBM/v1.0/*')
global with sharing class OBM_Receiver {
    @HttpGet
    global static String helloWorld() {
        return 'Hello World: ' + Datetime.now();
    }
    
    @HttpPost
    global static Result createEntry(String validator, String content) {
        if (Schema.sObjectType.OBM__c.isCreateable()) {
            // Create record
            OBM__c obm = new OBM__c();
            obm.Validator__c = validator;
            insert obm;
            
            // Create Attachment
            Attachment a = new Attachment();
            a.Body = Blob.valueOf(content);
            a.ContentType = 'application/json';
            a.Name = 'OBMData.json';
            a.ParentId = obm.Id;
            insert a;            
        } else {
            System.debug('Security Failed');
        }
        
        return new Result(true);
    }
    
    global class Result {
        public Boolean success { get; set; }
        public Result(Boolean success) {
            this.success = success;
        }
    }
}