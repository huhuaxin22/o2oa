package com.x.organization.assemble.express.jaxrs.wrapout;

import java.util.List;

import com.x.base.core.gson.GsonPropertyObject;
import com.x.base.core.http.annotation.Wrap;
import com.x.organization.core.entity.Group;

@Wrap(Group.class)
public class WrapOutGroup extends GsonPropertyObject {

	private String name;
	private String display;

	private List<String> groupList;

	private List<String> personList;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplay() {
		return display;
	}

	public void setDisplay(String display) {
		this.display = display;
	}

	public List<String> getGroupList() {
		return groupList;
	}

	public void setGroupList(List<String> groupList) {
		this.groupList = groupList;
	}

	public List<String> getPersonList() {
		return personList;
	}

	public void setPersonList(List<String> personList) {
		this.personList = personList;
	}

}