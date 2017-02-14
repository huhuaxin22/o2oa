package com.x.processplatform.assemble.surface.jaxrs.queryview;

import com.x.base.core.application.jaxrs.StandardJaxrsAction;
import com.x.base.core.bean.BeanCopyTools;
import com.x.base.core.bean.BeanCopyToolsBuilder;
import com.x.processplatform.assemble.surface.wrapout.element.WrapOutQueryView;
import com.x.processplatform.core.entity.element.QueryView;

public abstract class ActionBase extends StandardJaxrsAction {

	protected static BeanCopyTools<QueryView, WrapOutQueryView> outCopier = BeanCopyToolsBuilder.create(QueryView.class,
			WrapOutQueryView.class, null, WrapOutQueryView.Excludes);
	



}