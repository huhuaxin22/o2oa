package com.x.processplatform.assemble.bam.jaxrs.period;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.utils.DateRange;
import com.x.base.core.utils.SortTools;
import com.x.processplatform.assemble.bam.Business;
import com.x.processplatform.assemble.bam.stub.CompanyStub;
import com.x.processplatform.assemble.bam.stub.CompanyStubs;
import com.x.processplatform.assemble.bam.stub.DepartmentStub;
import com.x.processplatform.assemble.bam.stub.DepartmentStubs;
import com.x.processplatform.core.entity.content.WorkCompleted;
import com.x.processplatform.core.entity.content.WorkCompleted_;

public class TimerCompletedWorkCompanyStubs extends ActionBase {
	public CompanyStubs execute(EntityManagerContainer emc) throws Exception {
		Business business = new Business(emc);
		DateRange dateRange = this.getDateRange();
		Set<String> companies = new HashSet<>();
		companies.addAll(this.listCompanyFromWorkCompleted(business, dateRange));
		List<CompanyStub> list = new ArrayList<>();
		for (String str : companies) {
			CompanyStub stub = new CompanyStub();
			stub.setName(str);
			stub.setValue(str);
			stub.setDepartmentStubs(this.concreteDepartmentStubs(business, dateRange, stub));
			list.add(stub);
		}
		SortTools.asc(list, "name");
		CompanyStubs stubs = new CompanyStubs();
		stubs.addAll(list);
		return stubs;
	}

	private Collection<String> listCompanyFromWorkCompleted(Business business, DateRange dateRange) throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(WorkCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<WorkCompleted> root = cq.from(WorkCompleted.class);
		Predicate p = cb.between(root.get(WorkCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		cq.select(root.get(WorkCompleted_.creatorCompany)).distinct(true).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		return list;
	}

	private DepartmentStubs concreteDepartmentStubs(Business business, DateRange dateRange, CompanyStub companyStub)
			throws Exception {
		Set<String> departments = new HashSet<>();
		departments.addAll(this.listDepartmentFromWorkCompleted(business, dateRange, companyStub));
		List<DepartmentStub> list = new ArrayList<>();
		for (String str : departments) {
			DepartmentStub stub = new DepartmentStub();
			stub.setName(str);
			stub.setValue(str);
			stub.setCompanyName(companyStub.getName());
			stub.setCompanyValue(companyStub.getValue());
			list.add(stub);
		}
		SortTools.asc(list, "name");
		DepartmentStubs stubs = new DepartmentStubs();
		stubs.addAll(list);
		return stubs;
	}

	private Collection<String> listDepartmentFromWorkCompleted(Business business, DateRange dateRange,
			CompanyStub companyStub) throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(WorkCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<WorkCompleted> root = cq.from(WorkCompleted.class);
		Predicate p = cb.between(root.get(WorkCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		p = cb.and(p, cb.equal(root.get(WorkCompleted_.creatorCompany), companyStub.getValue()));
		cq.select(root.get(WorkCompleted_.creatorDepartment)).distinct(true).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		return list;
	}
}