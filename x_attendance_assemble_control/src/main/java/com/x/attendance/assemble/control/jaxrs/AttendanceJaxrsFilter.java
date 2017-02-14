package com.x.attendance.assemble.control.jaxrs;

import javax.servlet.annotation.WebFilter;

import com.x.base.core.application.jaxrs.ManagerUserJaxrsFilter;

/**
 * web服务过滤器，将指定的URL定义为需要用户认证的服务，如果用户未登录，则无法访问该服务
 * @author liyi *
 */
@WebFilter(urlPatterns = { 
		"/jaxrs/attendanceadmin/*",
		"/jaxrs/attendancedetail/*",
		"/jaxrs/attendancedetail/mobile/*",
		"/jaxrs/attendancedetailbakup/*",
		"/jaxrs/attendanceappealInfo/*",
		"/jaxrs/attendanceimportfileinfo/*",
		"/jaxrs/attendanceschedulesetting/*",
		"/jaxrs/attendancesetting/*",
		"/jaxrs/attendanceworkdayconfig/*",
		"/jaxrs/attendanceselfholiday/*",
		"/jaxrs/fileimport/*",
		"/jaxrs/statistic/*",
		"/jaxrs/statisticshow/*",
		"/jaxrs/attendancestatisticalcycle/*",
		"/jaxrs/attendancestatisticrequirelog/*",
		"/jaxrs/attendanceemployeeconfig/*",
		"/jaxrs/uuid/*",
		"/servlet/*"
})
public class AttendanceJaxrsFilter extends ManagerUserJaxrsFilter {
	
}