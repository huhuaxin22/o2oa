/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.okr.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.okr.entity.OkrPermissionInfo.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Dec 02 16:18:45 CST 2016")
public class OkrPermissionInfo_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<OkrPermissionInfo,Date> createTime;
    public static volatile SingularAttribute<OkrPermissionInfo,String> description;
    public static volatile SingularAttribute<OkrPermissionInfo,String> id;
    public static volatile SingularAttribute<OkrPermissionInfo,String> permissionCode;
    public static volatile SingularAttribute<OkrPermissionInfo,String> permissionName;
    public static volatile SingularAttribute<OkrPermissionInfo,String> sequence;
    public static volatile SingularAttribute<OkrPermissionInfo,Date> updateTime;
}
