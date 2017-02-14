package com.x.base.core.project;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.x.base.core.entity.StorageType;
import com.x.base.core.gson.XGsonBuilder;

public class x_processplatform_service_processing_trigger extends Service {

	public static List<String> containerEntities = new ArrayList<>();
	public static List<StorageType> usedStorageTypes = new ArrayList<>();
	public static List<Class<? extends Compilable>> dependents = new ArrayList<>();

	static {
		containerEntities.add("com.x.processplatform.core.entity.content.Work");
		containerEntities.add("com.x.processplatform.core.entity.temporary.TriggerWorkRecord");
		containerEntities.add("com.x.processplatform.core.entity.element.Application");
		dependents.add(x_base_core_project.class);
		dependents.add(x_organization_core_entity.class);
		dependents.add(x_organization_core_express.class);
		dependents.add(x_processplatform_core_entity.class);
		dependents.add(x_collaboration_core_entity.class);
		dependents.add(x_collaboration_core_message.class);
	}

	protected void custom(File lib, String xLib) throws Exception {
		// File xLibDir = new File(xLib);
		// File libDir = new File(lib, "WEB-INF/lib");
		// for (Class<? extends Compilable> clz : dependents) {
		// FileUtils.copyDirectory(xLibDir, libDir, new
		// NameFileFilter(clz.getSimpleName() + "-" + VERSION + ".jar"));
		// }
	}

	public static void main(String[] args) {
		try {
			String str = args[0];
			str = StringUtils.replace(str, "\\", "/");
			Argument arg = XGsonBuilder.instance().fromJson(str, Argument.class);
			x_processplatform_service_processing_trigger o = new x_processplatform_service_processing_trigger();
			o.pack(arg.getDistPath(), arg.getRepositoryPath());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
