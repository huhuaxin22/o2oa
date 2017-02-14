package com.x.processplatform.assemble.bam.jaxrs.period;

import com.x.base.core.http.ActionResult;
import com.x.processplatform.assemble.bam.ThisApplication;
import com.x.processplatform.assemble.bam.stub.ApplicationStubs;

class ActionListStartTaskApplicationStubs extends ActionBase {

	ActionResult<ApplicationStubs> execute() throws Exception {
		ActionResult<ApplicationStubs> result = new ActionResult<>();
		result.setData(ThisApplication.period.getStartTaskApplicationStubs());
		return result;
	}

}