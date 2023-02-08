import { isArray } from "lodash";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { File_URL, USER } from "../common/constants";
import { Text } from "../components";
import { mailsUpdate } from "../configuration/redux/Auth.slice";
import { Del, Get, Put } from "../configuration/server";
const MailAttachments = ({ firstName, attachment }) => {
  try {
    const list = JSON.parse(attachment);
    return (
      <div className="flex-row gap12 p6">
        {list.map((v, i) => (
          <div className="pointy p2" key={"a-" + i}>
            <a href={File_URL + v} download={firstName + "-cv-" + i} target="_blank" rel="noopener noreferrer">
              attachment-{i + 1}
            </a>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    // console.warn("this is a controlled error:", error);
    return null;
  }
};
const Mail = () => {
  const { mails, role } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const fetchMails = () => {
    Get("mailsByTypeMessage", (data) => {
      Get("mailsByTypeVacancy", (data2) => {
        dispatch(mailsUpdate([...data, ...data2].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))));
      });
    });
  };
  const readMail = (id) => {
    Put(["mails", id], { seen: true }, fetchMails);
  };
  const deleteMail = (id) => {
    Del(["mails", "single", id], fetchMails);
  };
  useEffect(() => {
    if (role !== USER) {
      fetchMails();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="body-box">
      <div className="form-container">
        <div className="window">
          <div className="header">
            <div className="mini-max f1 justify-right">
              <div className="button other" onClick={fetchMails}>
                <p>Refresh</p>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="item">
              {isArray(mails) &&
                mails.map(({ id, firstName, lastName, content, createdAt, seen, email, phone, attachment, type }) => (
                  <div key={id} className="mail-divider">
                    <div className="f6">
                      <div className="flex-row justify-between mb12 p8">
                        <div className="flex-row gap16 align-center">
                          <Text type="Button">{`From: ${firstName} ${lastName}`}</Text>
                          <Text type="Cap" className="pointy" onClick={() => navigator.clipboard.writeText(email)}>
                            {email}
                          </Text>
                          <Text type="Cap">{phone}</Text>
                        </div>
                        <Text type="Body2">
                          {moment(createdAt).isBefore(moment().startOf("day"))
                            ? moment(createdAt).format("MMM D HH:mm")
                            : moment(createdAt).from()}
                        </Text>
                      </div>
                      <div className={`bg-white mb6 p8 ${seen ? "" : "pointy"}`} onClick={() => readMail(id)}>
                        <Text> {content}</Text>
                      </div>
                      <MailAttachments {...{ attachment, firstName }} />
                    </div>
                    <div className="flex-col gap6 m6">
                      <div className="mail-delete mail-btn" onClick={() => deleteMail(id)}>
                        delete
                      </div>
                      <div className="mail-btn bg-navy-blue">{type}</div>
                      {!seen ? <div className="mail-new mail-btn">new</div> : null}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mail;
