package com.x.meeting.assemble.control;

import javax.servlet.annotation.WebListener;

import com.x.base.core.project.AbstractApplicationServletContextListener;
import com.x.base.core.project.ThisApplicationClass;
import com.x.base.core.project.x_meeting_assemble_control;

@WebListener
@ThisApplicationClass(ThisApplication.class)
public class ApplicationServletContextListener extends AbstractApplicationServletContextListener {

	@Override
	public Class<?> getThis() {
		return x_meeting_assemble_control.class;
	}

}
