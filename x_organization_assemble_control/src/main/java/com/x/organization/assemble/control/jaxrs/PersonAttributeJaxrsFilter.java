package com.x.organization.assemble.control.jaxrs;

import javax.servlet.annotation.WebFilter;

import com.x.base.core.application.jaxrs.ManagerUserJaxrsFilter;

@WebFilter(urlPatterns = {  "/jaxrs/personattribute/*"})
public class PersonAttributeJaxrsFilter extends ManagerUserJaxrsFilter {

}
