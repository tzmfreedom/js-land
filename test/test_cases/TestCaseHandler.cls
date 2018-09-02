public class TestCaseHandler {
    public static String run(String klassName) {
        LandCaseInterface landCase = (LandCaseInterface)Type.forName(klassName).newInstance();
        Map<String, Object> result = landCase.run();
        return JSON.serialize(result);
    }
}