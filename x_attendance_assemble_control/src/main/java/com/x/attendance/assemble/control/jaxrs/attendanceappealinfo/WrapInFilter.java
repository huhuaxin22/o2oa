package com.x.attendance.assemble.control.jaxrs.attendanceappealinfo;

import java.util.List;

import com.x.attendance.entity.AttendanceAppealInfo;
import com.x.base.core.bean.NameValueCountPair;
import com.x.base.core.gson.GsonPropertyObject;
import com.x.base.core.http.annotation.Wrap;

@Wrap( AttendanceAppealInfo.class)
public class WrapInFilter extends GsonPropertyObject {

	private List<NameValueCountPair> appIdList;
	
	private List<NameValueCountPair> orAtrribute;

	private String key;	

	public List<NameValueCountPair> getAppIdList() {
		return appIdList;
	}

	public void setAppIdList(List<NameValueCountPair> appIdList) {
		this.appIdList = appIdList;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public List<NameValueCountPair> getOrAtrribute() {
		return orAtrribute;
	}

	public void setOrAtrribute(List<NameValueCountPair> orAtrribute) {
		this.orAtrribute = orAtrribute;
	}
	
}
