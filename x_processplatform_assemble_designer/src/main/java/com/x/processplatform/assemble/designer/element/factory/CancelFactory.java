package com.x.processplatform.assemble.designer.element.factory;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.x.processplatform.assemble.designer.AbstractFactory;
import com.x.processplatform.assemble.designer.Business;
import com.x.processplatform.core.entity.element.Cancel;
import com.x.processplatform.core.entity.element.Cancel_;

public class CancelFactory extends AbstractFactory {

	public CancelFactory(Business business) throws Exception {
		super(business);
	}

	public List<String> listWithProcess(String id) throws Exception {
		EntityManager em = this.entityManagerContainer().get(Cancel.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<Cancel> root = cq.from(Cancel.class);
		Predicate p = cb.equal(root.get(Cancel_.process), id);
		cq.select(root.get(Cancel_.id)).where(p);
		return em.createQuery(cq).getResultList();
	}
}