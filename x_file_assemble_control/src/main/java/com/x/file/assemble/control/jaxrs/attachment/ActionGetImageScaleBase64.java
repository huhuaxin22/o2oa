package com.x.file.assemble.control.jaxrs.attachment;

import static com.x.base.core.entity.StorageType.file;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.lang3.ArrayUtils;
import org.imgscalr.Scalr;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.exception.ExceptionWhen;
import com.x.base.core.http.ActionResult;
import com.x.base.core.http.EffectivePerson;
import com.x.base.core.http.WrapOutString;
import com.x.base.core.project.server.StorageMapping;
import com.x.file.assemble.control.ThisApplication;
import com.x.file.core.entity.Attachment;

public class ActionGetImageScaleBase64 extends ActionBase {

	public ActionResult<WrapOutString> execute(EffectivePerson effectivePerson, String id, Integer scale)
			throws Exception {
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			ActionResult<WrapOutString> result = new ActionResult<>();
			Attachment attachment = emc.find(id, Attachment.class, ExceptionWhen.not_found);
			/* 判断文件的当前用户是否是管理员或者文件创建者 或者当前用户在分享或者共同编辑中 */
			if (effectivePerson.isNotManager() && effectivePerson.isNotUser(attachment.getPerson())
					&& effectivePerson.isNotUser(attachment.getShareList())
					&& effectivePerson.isNotUser(attachment.getEditorList())) {
				throw new Exception(
						"person{name:" + effectivePerson.getName() + "} access attachment{id:" + id + "} denied.");
			}
			if (!ArrayUtils.contains(ImageExtensions, attachment.getExtension())) {
				throw new Exception("attachment not image file.");
			}
			if (scale < 0 || scale > 100) {
				throw new Exception("invaild scale:" + scale + ".");
			}
			StorageMapping mapping = ThisApplication.storageMappings.get(file, attachment.getStorage());
			try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
				attachment.readContent(mapping, output);
				try (ByteArrayInputStream input = new ByteArrayInputStream(output.toByteArray())) {
					BufferedImage src = ImageIO.read(input);
					int width = (src.getWidth() * scale) / (int) 100;
					int height = (src.getHeight() * scale) / (int) 100;
					BufferedImage scalrImage = Scalr.resize(src, width, height);
					try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
						ImageIO.write(scalrImage, "png", baos);
						String str = Base64.encodeBase64String(baos.toByteArray());
						WrapOutString wrap = new WrapOutString();
						wrap.setValue(str);
						result.setData(wrap);
					}
				}
			}
			return result;
		}
	}
}