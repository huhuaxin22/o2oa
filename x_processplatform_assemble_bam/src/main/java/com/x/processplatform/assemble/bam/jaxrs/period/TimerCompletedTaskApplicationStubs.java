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

import org.apache.commons.lang3.StringUtils;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.utils.DateRange;
import com.x.base.core.utils.SortTools;
import com.x.processplatform.assemble.bam.Business;
import com.x.processplatform.assemble.bam.stub.ActivityStub;
import com.x.processplatform.assemble.bam.stub.ActivityStubs;
import com.x.processplatform.assemble.bam.stub.ApplicationStub;
import com.x.processplatform.assemble.bam.stub.ApplicationStubs;
import com.x.processplatform.assemble.bam.stub.ProcessStub;
import com.x.processplatform.assemble.bam.stub.ProcessStubs;
import com.x.processplatform.core.entity.content.TaskCompleted;
import com.x.processplatform.core.entity.content.TaskCompleted_;

public class TimerCompletedTaskApplicationStubs extends ActionBase {

	public ApplicationStubs execute(EntityManagerContainer emc) throws Exception {
		Business business = new Business(emc);
		Set<String> ids = new HashSet<>();
		DateRange dateRange = this.getDateRange();
		ids.addAll(this.listApplicationFromTaskCompleted(business, dateRange));
		List<ApplicationStub> list = new ArrayList<>();
		for (String str : ids) {
			String name = this.getApplicationName(business, dateRange, str);
			ApplicationStub stub = new ApplicationStub();
			stub.setName(name);
			stub.setValue(str);
			stub.setProcessStubs(this.concreteProcessStubs(business, dateRange, stub));
			list.add(stub);
		}
		SortTools.asc(list, "name");
		ApplicationStubs stubs = new ApplicationStubs();
		stubs.addAll(list);
		return stubs;
	}

	private Collection<String> listApplicationFromTaskCompleted(Business business, DateRange dateRange)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.between(root.get(TaskCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		cq.select(root.get(TaskCompleted_.application)).distinct(true).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		return list;
	}

	private String getApplicationName(Business business, DateRange dateRange, String applicationId) throws Exception {
		String value = this.getApplicationNameFromTaskCompleted(business, dateRange, applicationId);
		return StringUtils.trimToEmpty(value);
	}

	private String getApplicationNameFromTaskCompleted(Business business, DateRange dateRange, String applicationId)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.between(root.get(TaskCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		p = cb.and(p, cb.equal(root.get(TaskCompleted_.application), applicationId));
		cq.select(root.get(TaskCompleted_.applicationName)).where(p);
		List<String> list = em.createQuery(cq).setMaxResults(1).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	private ProcessStubs concreteProcessStubs(Business business, DateRange dateRange, ApplicationStub applicationStub)
			throws Exception {
		/* 所有属于applicationId的processId总和 */
		Set<String> ids = new HashSet<>();
		ids.addAll(this.listProcessFromTaskCompleted(business, dateRange, applicationStub));
		List<ProcessStub> list = new ArrayList<>();
		for (String str : ids) {
			String name = this.getProcessName(business, dateRange, str);
			ProcessStub stub = new ProcessStub();
			stub.setName(name);
			stub.setValue(str);
			stub.setApplicationCategory(applicationStub.getCategory());
			stub.setApplicationName(applicationStub.getName());
			stub.setApplicationValue(applicationStub.getValue());
			stub.setActivityStubs(this.concreteActivityStubs(business, dateRange, stub));
			list.add(stub);
		}
		SortTools.asc(list, "name");
		ProcessStubs stubs = new ProcessStubs();
		stubs.addAll(list);
		return stubs;
	}

	private Collection<String> listProcessFromTaskCompleted(Business business, DateRange dateRange,
			ApplicationStub applicationStub) throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.equal(root.get(TaskCompleted_.application), applicationStub.getValue());
		cq.select(root.get(TaskCompleted_.process)).distinct(true).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		return list;
	}

	private String getProcessName(Business business, DateRange dateRange, String processId) throws Exception {
		String value = this.getProcessNameFromTaskCompleted(business, dateRange, processId);
		return StringUtils.trimToEmpty(value);
	}

	private String getProcessNameFromTaskCompleted(Business business, DateRange dateRange, String processId)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.between(root.get(TaskCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		p = cb.and(p, cb.equal(root.get(TaskCompleted_.process), processId));
		cq.select(root.get(TaskCompleted_.processName)).where(p);
		List<String> list = em.createQuery(cq).setMaxResults(1).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	private ActivityStubs concreteActivityStubs(Business business, DateRange dateRange, ProcessStub processStub)
			throws Exception {
		Set<String> ids = new HashSet<>();
		ids.addAll(this.listActivityFromTaskCompleted(business, dateRange, processStub));
		List<ActivityStub> list = new ArrayList<>();
		for (String str : ids) {
			String name = this.getActivityName(business, dateRange, str);
			ActivityStub stub = new ActivityStub();
			stub.setName(name);
			stub.setValue(str);
			stub.setApplicationCategory(processStub.getApplicationCategory());
			stub.setApplicationName(processStub.getApplicationName());
			stub.setApplicationValue(processStub.getApplicationValue());
			stub.setProcessName(processStub.getName());
			stub.setProcessValue(processStub.getValue());
			list.add(stub);
		}
		SortTools.asc(list, "name");
		ActivityStubs stubs = new ActivityStubs();
		stubs.addAll(list);
		return stubs;
	}

	private Collection<String> listActivityFromTaskCompleted(Business business, DateRange dateRange,
			ProcessStub processStub) throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.between(root.get(TaskCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		p = cb.and(p, cb.equal(root.get(TaskCompleted_.process), processStub.getValue()));
		cq.select(root.get(TaskCompleted_.activity)).distinct(true).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		return list;
	}

	private String getActivityName(Business business, DateRange dateRange, String activityId) throws Exception {
		String value = this.getActivityNameFromTaskCompleted(business, dateRange, activityId);
		return StringUtils.trimToEmpty(value);
	}

	private String getActivityNameFromTaskCompleted(Business business, DateRange dateRange, String activityId)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		EntityManager em = emc.get(TaskCompleted.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<TaskCompleted> root = cq.from(TaskCompleted.class);
		Predicate p = cb.between(root.get(TaskCompleted_.completedTime), dateRange.getStart(), dateRange.getEnd());
		p = cb.and(p, cb.equal(root.get(TaskCompleted_.activity), activityId));
		cq.select(root.get(TaskCompleted_.activityName)).where(p);
		List<String> list = em.createQuery(cq).setMaxResults(1).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

}