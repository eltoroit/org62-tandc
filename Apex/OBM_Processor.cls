public class OBM_Processor {
    @future
    public static void execute(ID obmId) {
        OBM__c obm = [SELECT ID, Name, Status__c, Validator__c, (SELECT ID FROM Attachments) FROM OBM__c WHERE id = :obmId];
        OBM_Processor processor = new OBM_Processor();
        System.debug(processor.isValid(obm));
    }
    
    
    /*
    VALIDATOR CODE
    // JSON requires this value to be enclosed in double quotes
    String x = 'STRING_USED_TO_VALIDATE_MESSAGE|"2017-08-18T13:28:13.544Z"';
    String y = EncodingUtil.base64Encode(Blob.valueOf(x));
    y = 'U1RSSU5HX1VTRURfVE9fVkFMSURBVEVfTUVTU0FHRXwiMjAxNy0wOC0xOFQxMzo1MToxNi45OTNaIg==';
    */
    public Boolean isValid(OBM__c obm) {
		String encoded = obm.Validator__c;
		String decoded = EncodingUtil.base64Decode(encoded).toString();
        List<String> decodedParts = decoded.split('\\|');
        System.assertEquals('STRING_USED_TO_VALIDATE_MESSAGE', decodedParts[0], 'Message did not have proper validator (1)');
        DateTime dttmEncoded = (DateTime) JSON.deserialize(decodedParts[1], DateTime.class);
        DateTime dttmRecord = obm.CreatedDate;
    	Long millisecsEncoded = dttmEncoded.getTime();
        Long millisecsRecord = dttmRecord.getTime();
        Double diffMinutes = Math.abs(millisecsEncoded - millisecsRecord) / 60000.0;
        System.assert(diffMinutes < 2, 'Message did not have proper validator (2)');
        return true;
    }
}