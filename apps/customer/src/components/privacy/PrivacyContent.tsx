import { Divider, Stack, Typography } from "@mui/material";

export default function PrivacyContent() {
  return (
    <Stack spacing={5} className="text-[var(--rf-apple-muted)]">
      <section id="overview" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          1) ภาพรวม
        </Typography>
        <Typography className="apple-body-copy mt-2">
          นโยบายนี้อธิบายว่าเราเก็บ ใช้ เปิดเผย
          และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร
          เมื่อคุณใช้งานเว็บไซต์/แอปจองรถของเรา
        </Typography>
      </section>

      <section id="collect" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          2) ข้อมูลที่เราเก็บ
        </Typography>
        <ul className="apple-body-copy mt-3 list-disc space-y-2 pl-5">
          <li>
            ข้อมูลบัญชี: ชื่อ เบอร์โทร (ถ้ามี) และข้อมูลโปรไฟล์ที่คุณกรอก
          </li>
          <li>
            ข้อมูลการจอง: รายละเอียดรถ วันเวลา สถานที่รับ-คืน และสถานะการจอง
          </li>
          <li>
            ข้อมูลการชำระเงิน: ใช้เพื่อยืนยันสถานะรายการและจัดทำหลักฐานการจอง
            (เราอาจไม่เก็บเลขบัตรเต็ม)
          </li>
          <li>
            ข้อมูลการใช้งาน: IP, ประเภทอุปกรณ์, log การใช้งาน
            เพื่อความปลอดภัยและพัฒนาระบบ
          </li>
        </ul>
      </section>

      <section id="use" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          3) วัตถุประสงค์การใช้ข้อมูล
        </Typography>
        <ul className="apple-body-copy mt-3 list-disc space-y-2 pl-5">
          <li>ให้บริการจองรถ ยืนยันตัวตน และจัดการบัญชี</li>
          <li>ติดต่อแจ้งสถานะการจอง การเปลี่ยนแปลง หรือการสนับสนุนลูกค้า</li>
          <li>
            ป้องกันการทุจริต/การเข้าถึงที่ไม่พึงประสงค์ และดูแลความปลอดภัยระบบ
          </li>
          <li>วิเคราะห์และพัฒนาประสบการณ์การใช้งาน (เชิงสถิติ)</li>
        </ul>
      </section>

      <section id="share" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          4) การเปิดเผยข้อมูล
        </Typography>
        <Typography className="apple-body-copy mt-2">
          เราอาจเปิดเผยข้อมูลเท่าที่จำเป็นให้กับผู้ให้บริการที่เกี่ยวข้อง เช่น
          ร้านให้เช่าและระบบโครงสร้างพื้นฐานที่จำเป็นต่อการให้บริการ
          โดยจะดำเนินการภายใต้สัญญาและมาตรการที่เหมาะสม
        </Typography>
      </section>

      <section id="cookies" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          5) คุกกี้และการติดตาม
        </Typography>
        <Typography className="apple-body-copy mt-2">
          เราอาจใช้คุกกี้เพื่อการเข้าสู่ระบบ จดจำการตั้งค่า
          และวิเคราะห์การใช้งาน
          คุณสามารถจัดการคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์
        </Typography>
      </section>

      <section id="security" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          6) ความปลอดภัย
        </Typography>
        <Typography className="apple-body-copy mt-2">
          เราใช้มาตรการทางเทคนิคและการจัดการเพื่อปกป้องข้อมูล เช่น การเข้ารหัส
          การควบคุมสิทธิ์การเข้าถึง และการบันทึกเหตุการณ์ความปลอดภัย
        </Typography>
      </section>

      <section id="rights" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          7) สิทธิของเจ้าของข้อมูล
        </Typography>
        <ul className="apple-body-copy mt-3 list-disc space-y-2 pl-5">
          <li>ขอเข้าถึง/ขอสำเนาข้อมูล</li>
          <li>ขอแก้ไขข้อมูลให้ถูกต้อง</li>
          <li>
            ขอลบหรือทำให้ไม่สามารถระบุตัวตนได้ (ตามเงื่อนไขที่กฎหมายกำหนด)
          </li>
          <li>ถอนความยินยอม (หากการประมวลผลอาศัยความยินยอม)</li>
        </ul>
      </section>

      <section id="retain" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          8) ระยะเวลาการเก็บรักษา
        </Typography>
        <Typography className="apple-body-copy mt-2">
          เราจะเก็บข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์ของการให้บริการ
          หรือเท่าที่กฎหมายกำหนด หลังจากนั้นจะลบหรือทำให้ไม่สามารถระบุตัวตนได้
        </Typography>
      </section>

      <section id="contact" className="scroll-mt-28">
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          9) ติดต่อเรา
        </Typography>
        <Typography className="apple-body-copy mt-2">
          หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว
          โปรดติดต่อผ่านหน้าช่วยเหลือ
        </Typography>
      </section>

      <Divider className="my-1! border-black/10!" />

      <Typography className="apple-label-text text-[var(--rf-apple-muted)]">
        RentFlow ให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลผู้ใช้งาน
      </Typography>
    </Stack>
  );
}
