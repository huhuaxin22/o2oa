package com.x.processplatform.core.entity.element;

import com.x.base.core.entity.JpaObject;

public enum ResetRange {
	company, department, all;
	public static final int length = JpaObject.length_16B;
}
