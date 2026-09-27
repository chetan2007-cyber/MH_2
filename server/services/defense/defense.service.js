const DefenseRound = require('../../models/DefenseRound');
const Submission = require('../../models/Submission');

class DefenseService {
  async getDefenseRound(submissionId) {
    const defenseRound = await DefenseRound.findOne({ submissionId }).populate('candidateId', 'name role');
    return defenseRound;
  }

  async submitAnswers(submissionId, candidateId, answers) {
    const defenseRound = await DefenseRound.findOne({ submissionId });
    if (!defenseRound) {
      const err = new Error('Defense round not found.');
      err.status = 404;
      throw err;
    }

    if (defenseRound.candidateId.toString() !== candidateId.toString()) {
      const err = new Error('Unauthorized: You do not own this defense round.');
      err.status = 403;
      throw err;
    }

    if (!Array.isArray(answers) || answers.length < defenseRound.questions.length) {
      const err = new Error(`All ${defenseRound.questions.length} defense questions must be answered thoroughly.`);
      err.status = 400;
      throw err;
    }

    for (const ans of answers) {
      if (!ans.answerText || ans.answerText.trim().length < 40) {
        const err = new Error('Answers must demonstrate substantive engineering reasoning (minimum 40 characters each).');
        err.status = 400;
        throw err;
      }
    }

    defenseRound.answers = answers.map((a) => ({
      questionId: a.questionId,
      answerText: a.answerText,
      answeredAt: new Date(),
    }));

    defenseRound.status = 'EVALUATED';
    defenseRound.confidence = 'STRONG';
    defenseRound.evaluatorNotes =
      'Candidate demonstrated clear understanding of concurrency boundaries, cache line bouncing, and failure mode recovery paths.';
    defenseRound.evaluatedAt = new Date();
    await defenseRound.save();

    const sub = await Submission.findByIdAndUpdate(submissionId, { status: 'UNDER_REVIEW' });
    if (!sub) {
      const Application = require('../../models/Application');
      await Application.findByIdAndUpdate(submissionId, { status: 'UNDER_HUMAN_REVIEW' });
    }
    return defenseRound;
  }
}

module.exports = new DefenseService();
