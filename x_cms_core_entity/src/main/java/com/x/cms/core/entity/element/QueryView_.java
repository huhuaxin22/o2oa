/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.cms.core.entity.element;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Boolean;
import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.cms.core.entity.element.QueryView.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Dec 02 16:17:48 CST 2016")
public class QueryView_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<QueryView,String> afterCalculateGridScriptText;
    public static volatile SingularAttribute<QueryView,String> afterGridScriptText;
    public static volatile SingularAttribute<QueryView,String> afterGroupGridScriptText;
    public static volatile SingularAttribute<QueryView,String> alias;
    public static volatile SingularAttribute<QueryView,String> appId;
    public static volatile ListAttribute<QueryView,String> availableCompanyList;
    public static volatile ListAttribute<QueryView,String> availableDepartmentList;
    public static volatile ListAttribute<QueryView,String> availableIdentityList;
    public static volatile ListAttribute<QueryView,String> availablePersonList;
    public static volatile ListAttribute<QueryView,String> controllerList;
    public static volatile SingularAttribute<QueryView,Date> createTime;
    public static volatile SingularAttribute<QueryView,String> creatorPerson;
    public static volatile SingularAttribute<QueryView,String> data;
    public static volatile SingularAttribute<QueryView,String> description;
    public static volatile SingularAttribute<QueryView,String> icon;
    public static volatile SingularAttribute<QueryView,String> id;
    public static volatile SingularAttribute<QueryView,String> lastUpdatePerson;
    public static volatile SingularAttribute<QueryView,Date> lastUpdateTime;
    public static volatile SingularAttribute<QueryView,String> layout;
    public static volatile SingularAttribute<QueryView,String> name;
    public static volatile SingularAttribute<QueryView,String> sequence;
    public static volatile SingularAttribute<QueryView,Boolean> timingEnable;
    public static volatile SingularAttribute<QueryView,Integer> timingInterval;
    public static volatile SingularAttribute<QueryView,Integer> timingTouch;
    public static volatile SingularAttribute<QueryView,Date> updateTime;
}
