public class Hoge {
    public Integer a;
    public Integer b = 1;
    public static Integer b = 1;

    public Integer c { public get; private set; }

    public Hoge() {

    }

    public Integer yo(){
        c = 1;
        return 10;
    }

    public static Integer action() {
        if (false) {
            return 1;
        }
        List<Account> accounts = [SELECT id, Name FROM Account WHERE Name LIKE '%test%' AND Name LIKE '%JS%'];
        System.debug(accounts);
        // Integer [] j = new Integer[5];
        List<Integer> i = new List<Integer>();
        i.add(100);
        i.add(1000);
        System.debug(i[0]);
        System.debug(i.get(1));
        System.debug(i);
        Hoge h = new Hoge();
        // h.c = 909090;
        // System.debug(h.c);
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

        for (Integer iii = 0; iii < 5; iii++) {
            System.debug(iii);
        }

        for (Integer ii : i) {
            System.debug(ii);
        }
        for (Integer ii : i) {
            System.debug(ii);
        }

        System.debug('****');
        System.debug(new Hoge().hey(123));
        System.debug(new Hoge().yo());
        System.debug(new Hoge().b);
        System.debug('****');

        Integer iiii = 0;
        System.debug(iiii + 1);
        while(iiii < 5) {
            System.debug(iiii);
            iiii++;
        }

        try {
            throw new Hoge();
        } catch(Exception e) {
            System.debug(e);
        } finally {
            System.debug(1);
        }
        // _debugger
        System.debug(5*2);
        System.debug(1+3*5);
        System.debug(1.8*2.9);
        iiii = 5;
        System.debug(i);
        System.debug(h.fib(5));

        switch on i {
            when 2, 3 {
                System.debug(i);
            }
            when 1 {
                System.debug(111);
            }
            when else {
                System.debug(123);
            }
        }
        return 1;
    }

    public Integer fib(Integer i) {
        if (i < 2) {
            return i;
        }
        return fib(i-1) + fib(i-2);
    }

    public String hey(Integer b) {
        System.debug(123123123);
        return 'return';
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
