public class VariableDeclaration implements LandCaseInterface {
    public Map<String, Object> run() {
        String s = 'abc';
        Integer i = 1;
        Double d = 1.23;
        Boolean b = false;
        return new Map<String, Object> {
            'string' => s,
            'integer' => i,
            'double' => d,
            'boolean' => b
        };
    }
}