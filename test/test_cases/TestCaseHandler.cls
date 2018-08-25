public class TestCaseHandler {
    public static String run(String klassName) {
        LandCaseInterface landCase = Type.forName(klassName).newInstance();
        String result = landCase.run();
        return JSON.serialize(result);
    }
}