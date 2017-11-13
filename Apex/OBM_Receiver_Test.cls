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
}