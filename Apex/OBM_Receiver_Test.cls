@isTest
public class OBM_Receiver_Test {
    @isTest
    public static void testGet() {
        OBM_Receiver.helloWorld();
    }
    
    @isTest
    public static void testPost() {
        Test.startTest();
        OBM_Receiver.createEntry('V','F');
        Test.stopTest();
        OBM__c newObm = [SELECT ID FROM OBM__c];
        System.assertNotEquals(null, newObm.Id);        
        System.assertEquals(1, [SELECT ID FROM Attachment WHERE ParentID = :newObm.Id].Size());        
    }
    
    // OBM_Receiver.testCase();
    private static void testCase() {
        Contact co = [SELECT ID, RecordType.Name FROM Contact WHERE FirstName = 'Andres' AND RecordType.Name = 'Instructor'];
        Case ca = new Case();
        ca.ContactId = co.Id;
        ca.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get('Knowledge Check Manager or Course Bug Wizard').getRecordTypeId();
        ca.Reason = 'Project Work';
        ca.Subject = 'Test OBM';
        ca.Description = 'Test OBM';
        insert ca;
    }    
}