/**
 * DETERMINISTIC PROJECT STATE MACHINE (State Transitions & Reversion Engine)
 * Tiêu chuẩn: Tier-1 Finite State Machine với Guards và Rollback tự động
 */

export const PROJECT_STATES = [
  'DRAFT',
  'SPEC_FROZEN',
  'PARALLEL_CODING',
  'SECURITY_AUDITED',
  'QA_VERIFIED',
  'UAT_ACCEPTED',
  'READY_TO_DEPLOY'
];

export class ProjectStateMachine {
  // Bản đồ chuyển đổi trạng thái hợp lệ
  static VALID_TRANSITIONS = {
    DRAFT: ['SPEC_FROZEN'],
    SPEC_FROZEN: ['PARALLEL_CODING'],
    PARALLEL_CODING: ['SECURITY_AUDITED'],
    SECURITY_AUDITED: ['QA_VERIFIED', 'PARALLEL_CODING'], // Cho phép revert nếu fail
    QA_VERIFIED: ['UAT_ACCEPTED', 'PARALLEL_CODING'],
    UAT_ACCEPTED: ['READY_TO_DEPLOY', 'PARALLEL_CODING'],
    READY_TO_DEPLOY: []
  };

  /**
   * Chuyển trạng thái dự án có kiểm tra Guards và Reversion
   * @param {Object} ctx - Context của dự án:
   *   { id, state, hasApiContracts, hasTokens, securityAuditPassed, qaCoverage, blockers }
   * @param {string} nextState - Trạng thái đích muốn chuyển tới
   */
  static transition(ctx, nextState) {
    ctx.blockers = ctx.blockers || [];
    ctx.state = ctx.state || 'DRAFT';

    // 1. Kiểm tra tính hợp lệ của luồng chuyển
    const allowedNext = this.VALID_TRANSITIONS[ctx.state];
    if (!allowedNext || !allowedNext.includes(nextState)) {
      return {
        success: false,
        error: `Chuyển trạng thái bất hợp pháp: Không thể nhảy từ [${ctx.state}] sang [${nextState}].`
      };
    }

    // 2. Chốt chặn điều kiện (Guards)
    if (nextState === 'PARALLEL_CODING') {
      if (!ctx.hasApiContracts || !ctx.hasTokens) {
        return {
          success: false,
          error: 'Chặn: Chưa đóng băng API Contract (api.d.ts) hoặc thiếu tokens.json từ bộ phận Kiến trúc & UI.'
        };
      }
    }

    if (nextState === 'QA_VERIFIED') {
      if (!ctx.securityAuditPassed) {
        // Tự động giáng cấp về PARALLEL_CODING nếu vi phạm bảo mật
        ctx.state = 'PARALLEL_CODING';
        ctx.blockers.push(`[${new Date().toLocaleTimeString('vi-VN')}] Lỗi an ninh: Tự động giáng cấp trạng thái về PARALLEL_CODING.`);
        return {
          success: false,
          reverted: true,
          nextState: 'PARALLEL_CODING',
          error: 'Chặn: Phát hiện lỗ hổng an ninh. Đã tự động kích hoạt Rollback trạng thái về PARALLEL_CODING.'
        };
      }

      if (typeof ctx.qaCoverage === 'number' && ctx.qaCoverage < 70) {
        return {
          success: false,
          error: `Chặn: Độ bao phủ kiểm thử (Coverage) hiện tại là ${ctx.qaCoverage}%, chưa đạt mức tối thiểu 70%.`
        };
      }
    }

    // 3. Cập nhật trạng thái thành công
    const previousState = ctx.state;
    ctx.state = nextState;
    return {
      success: true,
      previousState,
      currentState: ctx.state
    };
  }
}

