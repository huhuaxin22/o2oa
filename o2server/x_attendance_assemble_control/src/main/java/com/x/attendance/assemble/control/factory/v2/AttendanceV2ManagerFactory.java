package com.x.attendance.assemble.control.factory.v2;

import com.x.attendance.assemble.control.AbstractFactory;
import com.x.attendance.assemble.control.Business;
import com.x.attendance.entity.v2.*;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;

/**
 * Created by fancyLou on 2023/1/31.
 * Copyright © 2023 O2. All rights reserved.
 */
public class AttendanceV2ManagerFactory  extends AbstractFactory {

    public AttendanceV2ManagerFactory(Business business) throws Exception {
        super(business);
    }
    /**
     * 查询考勤组列表
     * 分页查询需要
     * @param adjustPage
     * @param adjustPageSize
     * @param name 可以为空
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Group> listGroupWithNameByPage(Integer adjustPage,
                                                           Integer adjustPageSize, String name) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Group.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Group> cq = cb.createQuery(AttendanceV2Group.class);
        Root<AttendanceV2Group> root = cq.from(AttendanceV2Group.class);
        if (StringUtils.isNotEmpty(name)) {
            Predicate p = cb.like(root.get(AttendanceV2Group_.groupName), "%" + name + "%");
            cq.select(root).where(p).orderBy(cb.desc(root.get(AttendanceV2Group_.createTime)));
        } else {
            cq.select(root).orderBy(cb.desc(root.get(AttendanceV2Group_.createTime)));
        }
        return em.createQuery(cq).setFirstResult((adjustPage - 1) * adjustPageSize).setMaxResults(adjustPageSize)
                .getResultList();
    }

    /**
     * 查询考勤组总数
     * 分页查询需要
     * @param name 可以为空
     * @return
     * @throws Exception
     */
    public Long groupCountWithName(String name) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Group.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<AttendanceV2Group> root = cq.from(AttendanceV2Group.class);
        if (StringUtils.isNotEmpty(name)) {
            Predicate p = cb.like(root.get(AttendanceV2Group_.groupName), "%" + name + "%");
            return em.createQuery(cq.select(cb.count(root)).where(p)).getSingleResult();
        }
        return em.createQuery(cq.select(cb.count(root))).getSingleResult();
    }


    /**
     * 查询班次列表
     * 分页查询需要
     * @param adjustPage
     * @param adjustPageSize
     * @param name 可以为空
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Shift> listShiftWithNameByPage(Integer adjustPage,
                                                   Integer adjustPageSize, String name) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Shift.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Shift> cq = cb.createQuery(AttendanceV2Shift.class);
        Root<AttendanceV2Shift> root = cq.from(AttendanceV2Shift.class);
        if (StringUtils.isNotEmpty(name)) {
            Predicate p = cb.like(root.get(AttendanceV2Shift_.shiftName), "%" + name + "%");
            cq.select(root).where(p).orderBy(cb.desc(root.get(AttendanceV2Shift_.createTime)));
        } else {
            cq.select(root).orderBy(cb.desc(root.get(AttendanceV2Shift_.createTime)));
        }
        return em.createQuery(cq).setFirstResult((adjustPage - 1) * adjustPageSize).setMaxResults(adjustPageSize)
                .getResultList();
    }

    /**
     * 查询班次总数
     * 分页查询需要
     * @param name 可以为空
     * @return
     * @throws Exception
     */
    public Long shiftCountWithName(String name) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Shift.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<AttendanceV2Shift> root = cq.from(AttendanceV2Shift.class);
        if (StringUtils.isNotEmpty(name)) {
            Predicate p = cb.like(root.get(AttendanceV2Shift_.shiftName), "%" + name + "%");
            return em.createQuery(cq.select(cb.count(root)).where(p)).getSingleResult();
        }
        return em.createQuery(cq.select(cb.count(root))).getSingleResult();
    }

    /**
     * 根据班次id，查询使用到这个班次的所有考勤组
     * @param shiftId
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Group> listGroupWithShiftId(String shiftId) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Group.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Group> cq = cb.createQuery(AttendanceV2Group.class);
        Root<AttendanceV2Group> root = cq.from(AttendanceV2Group.class);
        Predicate p = cb.equal(root.get(AttendanceV2Group_.shiftId), shiftId);
        return em.createQuery(cq.select(root).where(p)).getResultList();
    }

    /**
     * 根据工作场所id，查询使用到这个工作场所的所有考勤组
     * @param workPlaceId
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Group> listGroupWithWorkPlaceId(String workPlaceId) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Group.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Group> cq = cb.createQuery(AttendanceV2Group.class);
        Root<AttendanceV2Group> root = cq.from(AttendanceV2Group.class);
        Predicate p = cb.isMember(workPlaceId, root.get(AttendanceV2Group_.workPlaceIdList));
        return em.createQuery(cq.select(root).where(p)).getResultList();
    }

    /**
     * 查询用户所属的考勤组
     * @param person distinguishName
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Group> listGroupWithPerson(String person) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Group.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Group> cq = cb.createQuery(AttendanceV2Group.class);
        Root<AttendanceV2Group> root = cq.from(AttendanceV2Group.class);
        Predicate p = cb.isMember(person, root.get(AttendanceV2Group_.trueParticipantList));
        return em.createQuery(cq.select(root).where(p)).getResultList();
    }


    /**
     * 查询打卡记录
     * @param person distinguishName
     * @param date 2023-02-20
     * @return
     * @throws Exception
     */
    public List<AttendanceV2CheckInRecord> listRecordWithPersonAndDate(String person, String date) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2CheckInRecord.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2CheckInRecord> cq = cb.createQuery(AttendanceV2CheckInRecord.class);
        Root<AttendanceV2CheckInRecord> root = cq.from(AttendanceV2CheckInRecord.class);
        Predicate p = cb.equal(root.get(AttendanceV2CheckInRecord_.userId), person);
        p = cb.and(p, cb.equal(root.get(AttendanceV2CheckInRecord_.recordDateString), date));
        return em.createQuery(cq.select(root).where(p).orderBy(cb.asc(root.get(AttendanceV2CheckInRecord_.recordDate)))).getResultList();
    }

    /**
     * 根据人员和日期 查询考勤详细
     * @param person
     * @param date
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Detail> listDetailWithPersonAndDate(String person, String date) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Detail.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Detail> cq = cb.createQuery(AttendanceV2Detail.class);
        Root<AttendanceV2Detail> root = cq.from(AttendanceV2Detail.class);
        Predicate p = cb.equal(root.get(AttendanceV2Detail_.userId), person);
        p = cb.and(p, cb.equal(root.get(AttendanceV2Detail_.recordDateString), date));
        return em.createQuery(cq.select(root).where(p)).getResultList();
    }



    /**
     * 查询考勤详细列表
     * 分页查询需要
     * @param adjustPage
     * @param adjustPageSize
     * @param userId 可以为空
     * @param startDate
     * @param endDate
     * @return
     * @throws Exception
     */
    public List<AttendanceV2Detail> listDetailByPage(Integer adjustPage,
                                                           Integer adjustPageSize, String userId, String startDate, String endDate) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Detail.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<AttendanceV2Detail> cq = cb.createQuery(AttendanceV2Detail.class);
        Root<AttendanceV2Detail> root = cq.from(AttendanceV2Detail.class);
        if (StringUtils.isNotEmpty(userId)) {
            Predicate p = cb.equal(root.get(AttendanceV2Detail_.userId), userId);
            p = cb.and(p, cb.lessThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), endDate));
            p = cb.and(p, cb.greaterThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), startDate));
            cq.select(root).where(p).orderBy(cb.asc(root.get(AttendanceV2Detail_.createTime)));
        } else {
            Predicate p =  cb.lessThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), endDate);
            p = cb.and(p, cb.greaterThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), startDate));
            cq.select(root).where(p).orderBy(cb.asc(root.get(AttendanceV2Detail_.createTime)));
        }
        return em.createQuery(cq).setFirstResult((adjustPage - 1) * adjustPageSize).setMaxResults(adjustPageSize)
                .getResultList();
    }

    /**
     * 查询考勤组总数
     * 分页查询需要
     * @param userId 可以为空
     * @param startDate
     * @param endDate
     * @return
     * @throws Exception
     */
    public Long detailCount(String userId, String startDate, String endDate) throws Exception {
        EntityManager em = this.entityManagerContainer().get(AttendanceV2Detail.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<AttendanceV2Detail> root = cq.from(AttendanceV2Detail.class);
        Predicate p =  cb.lessThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), endDate);
        p = cb.and(p, cb.greaterThanOrEqualTo(root.get(AttendanceV2Detail_.recordDateString), startDate));
        if (StringUtils.isNotEmpty(userId)) {
            p = cb.and(p,  cb.equal(root.get(AttendanceV2Detail_.userId), userId));
        }
        return em.createQuery(cq.select(cb.count(root)).where(p)).getSingleResult();
    }
}
