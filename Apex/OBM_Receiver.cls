@RestResource(urlMapping='/HandleOBM/v1.0/*')
global class OBM_Receiver {
	@HttpGet
    global static String helloWorld() {
    	return 'Hello World: ' + Datetime.now();
    }
    
	@HttpPost
    global static Result createEntry(String validator, String content) {
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
        
        // Fire the processing in a different thread.
        // OBM_Processor.execute(obm.Id);
        
        return new Result(true);
    }
    
    // OBM_Receiver.testCase();
    public static void testCase() {
        Contact co = [SELECT ID, RecordType.Name FROM Contact WHERE FirstName = 'Andres' AND RecordType.Name = 'Instructor'];
        Case ca = new Case();
		ca.ContactId = co.Id;
        ca.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get('Knowledge Check Manager or Course Bug Wizard').getRecordTypeId();
        ca.Reason = 'Project Work';
        ca.Subject = 'Test OBM';
        ca.Description = 'Test OBM';
        insert ca;
    }
    
    global class Result {
        public Boolean success { get; set; }
        public Result(Boolean success) {
            this.success = success;
        }
    }
}