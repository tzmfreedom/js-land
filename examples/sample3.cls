public class Hoge {
    public Integer a;
    public Integer b = 1;
    public static Integer b = 1;

    public Hoge() {

    }

    public static void action() {
        List<Account> accounts = [SELECT id FROM Account];
        System.debug(accounts);
        // Integer [] j = new Integer[5];
        List<Integer> i = new List<Integer>();
        i.add(100);
        i.add(1000);
        System.debug(i[0]);
        System.debug(i.get(1));
        System.debug(i);
        Hoge h = new Hoge();
        h.a = 1235787;
        System.debug(h.a);
        System.debug(h);
        System.debug('*** variable test assign***');
        System.debug(123);
        System.debug(123.4);
        System.debug('123123');
        System.debug(null);
        System.debug(true);
        System.debug(false);
        if (1 < 1) {
            System.debug('hey');
        } else if (false) {
            System.debug('yo');
        } else {
            System.debug('aaa');
        }

        for (Integer i = 0; i < 5; i++) {
            System.debug(i);
        }

        Integer i = 0;
        System.debug(i + 1);
        while(i < 5) {
            System.debug(i);
            i++;
        }
        System.debug(5*2);
        System.debug(1+3*5);
        System.debug(1.8*2.9);
        i = 3;
        System.debug(i);
    }

    public String hey(Integer b) {
        System.debug(123123123);
    }

    public void hello(String a, Integer b) {
        Integer c = 123;
        System.debug('hogehoge');

        List<Account> accounts = new List<Account>();
        List<Account> accounts2 = [SELECT id FROM Account];
        List<Account> object = (List<Account>)accounts;
        List<Map<String, List<Map<List<Account>, String>>>> acc;
        hey(1);
    }
}
