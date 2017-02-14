package com.x.organization.assemble.express.jaxrs.updatepersonattribute;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;

import com.x.base.core.application.jaxrs.AbstractJaxrsAction;
import com.x.base.core.cache.ApplicationCache;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.http.ActionResult;
import com.x.base.core.http.EffectivePerson;
import com.x.base.core.http.HttpMediaType;
import com.x.base.core.http.ResponseFactory;
import com.x.base.core.http.WrapOutId;
import com.x.base.core.http.annotation.HttpMethodDescribe;
import com.x.base.core.project.server.Config;
import com.x.organization.assemble.express.Business;
import com.x.organization.core.entity.PersonAttribute;

@Path("updatepersonattribute")
public class UpdatePersonAttributeAction extends AbstractJaxrsAction {

	@HttpMethodDescribe(value = "更新当前用户的PersonAttribute属性.")
	@PUT
	@Path("{name}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response setAttribute(@Context HttpServletRequest request, @PathParam("name") String name,
			WrapInUpdatePersonAttribute wrapIn) {
		ActionResult<WrapOutId> result = new ActionResult<>();
		WrapOutId wrap = null;
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			EffectivePerson effectivePerson = this.effectivePerson(request);
			if (!effectivePerson.isManager()) {
				Business business = new Business(emc);
				String personId = business.person().getWithName(effectivePerson.getName());
				if (StringUtils.isEmpty(personId)) {
					throw new Exception("person{name:" + name + "} not existed.");
				}
				String personAttributeId = business.personAttribute().getWithName(name, personId);
				PersonAttribute personAttribute = null;
				emc.beginTransaction(PersonAttribute.class);
				if (StringUtils.isEmpty(personAttributeId)) {
					personAttribute = new PersonAttribute();
					personAttribute.setName(name);
					personAttribute.setPerson(personId);
					emc.persist(personAttribute);
				} else {
					personAttribute = emc.find(personAttributeId, PersonAttribute.class);
				}
				personAttribute.setAttributeList(wrapIn.getAttributeList());
				emc.commit();
				ApplicationCache.notify(PersonAttribute.class);
				wrap = new WrapOutId(personAttribute.getId());
			} else {
				wrap = new WrapOutId(Config.administrator().getId());
			}
			result.setData(wrap);
		} catch (Throwable th) {
			th.printStackTrace();
			result.error(th);
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}

}