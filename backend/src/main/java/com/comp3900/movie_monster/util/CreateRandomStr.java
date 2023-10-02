package com.comp3900.movie_monster.util;

import java.util.Random;

public class CreateRandomStr {
    public static String createRandomStr1(int length){
        String str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(62);
            stringBuffer.append(str.charAt(number));
        }
        return stringBuffer.toString();
    }


    public static String createRandomStr2(int length){
        Random random = new Random();
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(3);
            long result = 0;
            switch (number) {
                case 0:
                    result = Math.round(Math.random()*25+65);
                    stringBuffer.append(String.valueOf((char)result));
                    break;
                case 1:
                    result = Math.round(Math.random()*25+97);
                    stringBuffer.append(String.valueOf((char)result));
                    break;
                case 2:
                    stringBuffer.append(String.valueOf(new Random().nextInt(10)));
                    break;
            }
        }
        return stringBuffer.toString();
    }
}
