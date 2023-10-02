package com.comp3900.movie_monster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class IntercepterConfig implements WebMvcConfigurer {

    @Autowired
    private EasyLogControllerInterceptor easyLogControllerInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //addPathPatterns用于添加拦截路径
        //excludePathPatterns用于添加不拦截的路径

        //拦截需要权限   /login  /
        registry.addInterceptor(easyLogControllerInterceptor).addPathPatterns("auth/logout/all"); //所有拦截
        registry.addInterceptor(easyLogControllerInterceptor).addPathPatterns("auth/logout");
        registry.addInterceptor(easyLogControllerInterceptor).addPathPatterns("auth/checktoken");

        registry.addInterceptor(easyLogControllerInterceptor).addPathPatterns("admin/**");
        registry.addInterceptor(easyLogControllerInterceptor).addPathPatterns("user/**");

    }


    //此方法用于配置静态资源路径
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/**").addResourceLocations("classpath:/my/");
    }
}

