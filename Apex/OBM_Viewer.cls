public class OBM_Viewer {
	@AuraEnabled
    public static List<OBM__c> getRecords_SC() {
        return [SELECT Id, Name, (SELECT ID FROM Attachments) FROM OBM__c ORDER BY CreatedDate ASC];
    }
    
    @AuraEnabled
    public static Boolean validateRecord_SC(ID obmId) {
        Boolean success;
        OBM_Processor processor = new OBM_Processor();
        OBM__c obm = [SELECT ID, Validator__c, CreatedDate FROM OBM__c WHERE Id = :obmId];
        try {
            success = processor.isValid(obm);
        } catch (Exception ex) {
			success = false;            
        }
        obm.Status__c = success ? 'Valid' : 'Failed';
        update obm;

        return success;
    }   
}