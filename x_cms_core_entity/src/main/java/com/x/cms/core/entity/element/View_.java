/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.cms.core.entity.element;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.cms.core.entity.element.View.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Dec 02 16:17:48 CST 2016")
public class View_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<View,String> alias;
    public static volatile SingularAttribute<View,String> appId;
    public static volatile SingularAttribute<View,String> content;
    public static volatile SingularAttribute<View,Date> createTime;
    public static volatile SingularAttribute<View,String> description;
    public static volatile SingularAttribute<View,String> editor;
    public static volatile ListAttribute<View,String> fieldConfigList;
    public static volatile SingularAttribute<View,String> formId;
    public static volatile SingularAttribute<View,String> id;
    public static volatile SingularAttribute<View,String> name;
    public static volatile SingularAttribute<View,String> orderField;
    public static volatile SingularAttribute<View,String> orderFieldType;
    public static volatile SingularAttribute<View,String> orderType;
    public static volatile SingularAttribute<View,Integer> pageSize;
    public static volatile SingularAttribute<View,String> sequence;
    public static volatile SingularAttribute<View,Date> updateTime;
}
